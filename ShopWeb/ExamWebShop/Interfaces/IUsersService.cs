using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Orders;
using ExamWebShop.Models.Users;

namespace ExamWebShop.Interfaces
{
    public interface IUsersService
    {
        IQueryable<RoleEntity> Roles { get; }
        Task<UserSearchResultViewModel> GetUsersAsync(UserSearchViewModel search);
        Task EditUserAsync(UserEditViewModel model);
    }
}
