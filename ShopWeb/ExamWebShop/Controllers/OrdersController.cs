using ExamWebShop.Constants;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Orders;
using ExamWebShop.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("statuses")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAllOrderStatuses()
        {
            var model = await _orderService.OrderStatuses.Select(x=>x.Name).ToListAsync();

            return Ok(model);
        }

        [HttpGet("all")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAllOrders([FromQuery] OrderSearchViewModel search)
        {
            var model = await _orderService.GetOrdersAsync(search);

            return Ok(model);
        }

        [HttpPut]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> ChangeOrderStatus(OrderEditStatusViewModel model)
        {
            await _orderService.SetOrderStatus(model.Email, model.Id, model.Name);

            return Ok();
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
