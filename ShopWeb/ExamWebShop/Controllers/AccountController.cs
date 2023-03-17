using ExamWebShop.Data;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly AppEFContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ISmtpEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService, AppEFContext context, IConfiguration configuration, ISmtpEmailService emailService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditUser(EditUserViewModel model)
        {
            if(!ModelState.IsValid) 
                return BadRequest();

            string email = User.Claims.First().Value;
            var user = await _userManager.FindByEmailAsync(email);

            if(!String.IsNullOrEmpty(user.Image) && !Regex.Match(user.Image, "/^(http(s):\\/\\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$/g").Success && user.Image != model.Image)
                ImageWorker.DeleteAllImages(user.Image, _configuration);

            user.Image = model.Image;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            await _context.SaveChangesAsync();

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpGet("confirmEmail")]
        [Authorize]
        public async Task<IActionResult> ConfirmEmailSend()
        {
            string email = User.Claims.First().Value;
            var user = await _userManager.FindByEmailAsync(email);

            if(user.EmailConfirmed)
                return BadRequest();

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var frontendUrl = _configuration.GetValue<string>("FrontEndURL");

            var callbackUrl = $"{frontendUrl}/profile/confirmemail?userId={user.Id}&" +
                $"code={WebUtility.UrlEncode(token)}";

            var dir = Path.Combine(Directory.GetCurrentDirectory(), "email-template", "confirmEmail.html");
            var html = System.IO.File.ReadAllText(dir);
            html = html.Replace("#", callbackUrl);

            var message = new Message()
            {
                To = user.Email,
                Subject = "Підтвердження електронної пошти",
                Body = html
            };
            _emailService.Send(message);
            return Ok();
        }

        [HttpPost("confirmEmail")]
        [Authorize]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var res = await _userManager.ConfirmEmailAsync(user, model.Token);

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound();

            if(!user.EmailConfirmed)
                return BadRequest();

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
            _emailService.Send(message);
            return Ok();
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var res = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            return Ok();
        }
    }
}
