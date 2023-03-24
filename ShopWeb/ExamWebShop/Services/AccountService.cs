using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Data;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using Microsoft.AspNetCore.Identity;
using ExamWebShop.Helpers;
using System.Text.RegularExpressions;
using System.Net;
using System.Collections;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ExamWebShop.Data.Entities;
using ExamWebShop.Constants;

namespace ExamWebShop.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly AppEFContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ISmtpEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AccountService(UserManager<UserEntity> userManager, AppEFContext context, IJwtTokenService jwtTokenService, ISmtpEmailService emailService, IConfiguration configuration, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task AddToBasket(string email, BasketViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var entity = _context.Baskets.SingleOrDefault(x=>x.ProductId == model.ProductId && x.UserId == user.Id);

            if (entity == null)
            {
                _context.Baskets.Add(new Data.Entities.BasketEntity()
                {
                    ProductId = model.ProductId,
                    UserId = user.Id,
                    Count = model.Count
                });
            }
            else
            {
                entity.Count = model.Count;
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFromBasket(string email, int productId)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var entity = _context.Baskets.SingleOrDefault(x => x.ProductId == productId && x.UserId == user.Id);

            if (entity != null)
            {
                _context.Baskets.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BasketItemViewModel>> Basket(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if(user == null)
                return null;

            var list = _context.Baskets
                .Include(x => x.Product)
                    .ThenInclude(x => x.Images)
                .Include(x => x.Product)
                    .ThenInclude(x => x.SaleProducts.Where(x => x.Sale.ExpireTime > DateTime.UtcNow).OrderByDescending(x => x.Sale.DecreasePercent))
                        .ThenInclude(x => x.Sale)
                .Include(x => x.Product)
                    .ThenInclude(x => x.Category)
                .Where(x => x.UserId == user.Id)
                .Select(x=>_mapper.Map<BasketItemViewModel>(x));

            return list.AsEnumerable();
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            return result.Succeeded;
        }

        public async Task<string> ConfirmEmailAsync(ConfirmEmailViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            await _userManager.ConfirmEmailAsync(user, model.Token);

            var token = await _jwtTokenService.CreateToken(user);
            return token;
        }

        public async Task<bool> SendConfirmEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user.EmailConfirmed)
                return false;

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var frontendUrl = _configuration.GetValue<string>("FrontEndURL");

            var callbackUrl = $"{frontendUrl}/profile?userId={user.Id}&" +
                $"code={WebUtility.UrlEncode(token)}";

            var dir = Path.Combine(Directory.GetCurrentDirectory(), "email-template", "confirmEmail.html");
            var html = File.ReadAllText(dir);
            html = html.Replace("#", callbackUrl);

            var message = new Message()
            {
                To = user.Email,
                Subject = "Підтвердження електронної пошти",
                Body = html
            };
            try
            {
                _emailService.Send(message);
            }
            catch 
            {
                return false;
            }


            return true;
        }

        public async Task<bool> SendForgotPasswordEmailAsync(ForgotPasswordViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return false;

            if (!user.EmailConfirmed)
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var frontendUrl = _configuration.GetValue<string>("FrontEndURL");

            var callbackUrl = $"{frontendUrl}/auth/resetpassword?userId={user.Id}&" +
                $"code={WebUtility.UrlEncode(token)}";

            var dir = Path.Combine(Directory.GetCurrentDirectory(), "email-template", "index.html");
            var html = System.IO.File.ReadAllText(dir);
            html = html.Replace("#", callbackUrl);

            var message = new Message()
            {
                To = user.Email,
                Subject = "Відновлення пароля",
                Body = html
            };
            try
            {
                _emailService.Send(message);
            }
            catch 
            {
                return false;
            }
            

            return true;
        }

        public async Task<string> UpdateAsync(string email, EditUserViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (!String.IsNullOrEmpty(user.Image) && !Regex.Match(user.Image, "/^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$/g").Success && user.Image != model.Image)
                ImageWorker.DeleteAllImages(user.Image, _configuration);

            user.Image = model.Image;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            await _context.SaveChangesAsync();

            var token = await _jwtTokenService.CreateToken(user);
            return token;
        }

        
    }
}
