using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IMapper _mapper;

        public AuthController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService, IMapper mapper)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _mapper = mapper;
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> GoogleLogin([FromBody] string googleToken)
        {
            if (string.IsNullOrWhiteSpace(googleToken))
                return BadRequest();

            var payload = await _jwtTokenService.VerifyGoogleToken(googleToken);

            if (payload == null)
                return BadRequest();

            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
                return BadRequest();

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("google/register")]
        public async Task<IActionResult> GoogleRegister([FromBody] GoogleRegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var payload = await _jwtTokenService.VerifyGoogleToken(model.Token);

            if (payload == null)
                return BadRequest();

            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new UserEntity
                    {
                        Email = payload.Email,
                        FirstName = model.FirstName,
                        UserName = payload.Email,
                        LastName = model.LastName,
                        Image = model.Image
                    };

                    var resultCreate = await _userManager.CreateAsync(user);
                    if (!resultCreate.Succeeded)
                        return BadRequest();
                    await _userManager.AddToRoleAsync(user, Roles.User);
                }

                var resultUserLogin = await _userManager.AddLoginAsync(user, info);
                if (!resultUserLogin.Succeeded)
                    return BadRequest();
            }

            var token = await _jwtTokenService.CreateToken(user);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            try
            {
                var user = await _userManager.FindByNameAsync(model.Email);

                if (user == null)
                    return NotFound();


                if (!await _userManager.CheckPasswordAsync(user, model.Password))
                    return BadRequest();

                var token = await _jwtTokenService.CreateToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            try
            {
                var user = _mapper.Map<UserEntity>(model);

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    result = await _userManager.AddToRoleAsync(user, Roles.User);

                    var token = await _jwtTokenService.CreateToken(user);
                    return Ok(new { token });
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
