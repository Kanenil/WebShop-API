using ExamWebShop.Constants;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using ExamWebShop.Models.Orders;
using ExamWebShop.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] OrderSearchViewModel search)
        {
            string email = User.Claims.First().Value;

            var model = await _orderService.GetOrdersAsync(email, search);

            return Ok(model);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            string email = User.Claims.First().Value;

            var model = await _orderService.GetOrderAsync(email, id);
            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            string email = User.Claims.First().Value;

            await _orderService.SetOrderStatus(email, id, OrderStatuses.Canceled);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> MakeOrder(CreateOrderViewModel model)
        {
            string email = User.Claims.First().Value;

            await _orderService.MakeOrderAsync(email, model);

            return Ok();
        }
    }
}
