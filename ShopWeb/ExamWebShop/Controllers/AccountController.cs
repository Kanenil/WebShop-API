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
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditUser(EditUserViewModel model)
        {
            if(!ModelState.IsValid) 
                return BadRequest();

            string email = User.Claims.First().Value;
            var token = await _accountService.UpdateAsync(email, model);

            return Ok(new { token });
        }

        [HttpGet("confirmEmail")]
        [Authorize]
        public async Task<IActionResult> ConfirmEmailSend()
        {
            string email = User.Claims.First().Value;
            
            if(!await _accountService.SendConfirmEmailAsync(email))
                return BadRequest();

            return Ok();
        }

        [HttpPost("confirmEmail")]
        [Authorize]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailViewModel model)
        {
            var token = await _accountService.ConfirmEmailAsync(model);
            return Ok(new { token });
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            if (!await _accountService.SendForgotPasswordEmailAsync(model))
                return BadRequest();

            return Ok();
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (!await _accountService.ChangePasswordAsync(model))
                return BadRequest();
            return Ok();
        }
        [HttpGet("basket")]
        [Authorize]
        public async Task<IActionResult> Basket()
        {
            string email = User.Claims.First().Value;
            
            var list = await _accountService.Basket(email);

            return Ok(new { list });
        }
        [HttpPut("basket")]
        [Authorize]
        public async Task<IActionResult> AddToBasket(BasketViewModel model)
        {
            string email = User.Claims.First().Value;

            await _accountService.AddToBasket(email, model);

            return Ok();
        }
        [HttpDelete("basket")]
        [Authorize]
        public async Task<IActionResult> DeleteFromBasket(int productId)
        {
            string email = User.Claims.First().Value;

            await _accountService.DeleteFromBasket(email, productId);

            return Ok();
        }
    }
}
