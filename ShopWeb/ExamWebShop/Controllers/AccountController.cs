using ExamWebShop.Data;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly AppEFContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService, AppEFContext context, IConfiguration configuration)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
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
    }
}
