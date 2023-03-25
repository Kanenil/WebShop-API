using ExamWebShop.Constants;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles =Roles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _usersService.Roles.Select(x => x.Name).ToListAsync();

            return Ok(roles);
        }

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] UserSearchViewModel search)
        {
            var model = await _usersService.GetUsersAsync(search);
            return Ok(model);
        }

        [HttpPut]
        public async Task<IActionResult> EditUser(UserEditViewModel model)
        {
            await _usersService.EditUserAsync(model);
            return Ok();
        }
    }
}
