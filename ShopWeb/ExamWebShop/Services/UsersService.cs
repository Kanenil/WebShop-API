using AutoMapper;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Orders;
using ExamWebShop.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamWebShop.Services
{
    public class UsersService : IUsersService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;

        public UsersService(UserManager<UserEntity> userManager, AppEFContext context, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        public IQueryable<RoleEntity> Roles => _context.Roles;

        public async Task EditUserAsync(UserEditViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if(int.TryParse(model.Time, out var time) && time > 0) 
                await _userManager.SetLockoutEndDateAsync(user, DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc).AddMinutes(time));
            else
                await _userManager.SetLockoutEndDateAsync(user, null);

            var userRoles = await _userManager.GetRolesAsync(user);

            if (!userRoles.Contains(model.Role) && time == 0)
            {
                await _userManager.RemoveFromRoleAsync(user, userRoles[0]);
                await _userManager.AddToRoleAsync(user, model.Role);
            }
        }

        public async Task<UserSearchResultViewModel> GetUsersAsync(UserSearchViewModel search)
        {
            var list = await _context.Users
                .Include(x=>x.UserRoles)
                    .ThenInclude(x=>x.Role)
                .Include(x=>x.Baskets)
                    .ThenInclude(x=>x.Product)
                        .ThenInclude(x=>x.Images.OrderBy(x=>x.Priority))
                .Include(x => x.Baskets)
                    .ThenInclude(x => x.Product)
                        .ThenInclude(x => x.Category)
                .Include(x => x.Baskets)
                    .ThenInclude(x => x.Product)
                        .ThenInclude(x => x.SaleProducts.OrderBy(x=>x.Sale.DecreasePercent))
                            .ThenInclude(x=>x.Sale)
                .Skip((search.Page - 1) * search.CountOnPage)
                .Take(search.CountOnPage)
                .Select(x => _mapper.Map<UserItemViewModel>(x))
                .ToListAsync();

            int total = list.Count();
            int pages = (int)Math.Ceiling(total / (double)search.CountOnPage);

            return new()
            {
                CurrentPage = search.Page,
                Pages = pages,
                Total = total,
                Users = list,
            };

            throw new NotImplementedException();
        }
    }
}
