using AutoMapper;
using ExamWebShop.Constants;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Data;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Orders;
using System.Collections.Generic;

namespace ExamWebShop.Services
{
    public class OrderService : IOrderService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly AppEFContext _context;
        private readonly IMapper _mapper;


        public OrderService(UserManager<UserEntity> userManager, AppEFContext context, IMapper mapper)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        public async Task<OrderItemViewModel> GetOrderAsync(string email, int id)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var order = _context.Orders
                .Include(x => x.OrderStatus)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                        .ThenInclude(x => x.Category)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                        .ThenInclude(x => x.Images.OrderBy(x => x.Priority))
                .SingleOrDefault(x => x.UserId == user.Id && x.Id == id);

            return order != null ? _mapper.Map<OrderItemViewModel>(order) : null;
        }

        public async Task<OrderSearchResultViewModel> GetOrdersAsync(string email, OrderSearchViewModel search)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var list = await _context.Orders
                .Include(x => x.OrderStatus)
                .Include(x => x.OrderItems)
                    .ThenInclude(x=>x.Product)
                        .ThenInclude(x=>x.Category)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                        .ThenInclude(x => x.Images.OrderBy(x=>x.Priority))
                .Where(x => x.UserId == user.Id)
                .Skip((search.Page - 1) * search.CountOnPage)
                .Take(search.CountOnPage)
                .Select(x=>_mapper.Map<OrderItemViewModel>(x))
                .ToListAsync();

            int total = list.Count();
            int pages = (int)Math.Ceiling(total / (double)search.CountOnPage);

            return new()
            {
                CurrentPage = search.Page,
                Pages = pages,
                Total = total,
                Orders = list,
            };
        }

        public async Task MakeOrderAsync(string email, CreateOrderViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var orderStatus = _context.OrderStatuses.SingleOrDefault(x => x.Name == OrderStatuses.New);

            var order = await _context.Orders.AddAsync(new()
            {
                UserId = user.Id,
                OrderStatusId = orderStatus.Id
            });
            await _context.SaveChangesAsync();

            foreach (var product in model.Products)
            {
                _context.OrderItems.Add(new()
                {
                    Count = product.Quantity,
                    OrderId = order.Entity.Id,
                    ProductId = product.Id,
                    PriceBuy = product.Price - ((product.Price * product.DecreasePercent) / 100)
                });
            }
            await _context.SaveChangesAsync();
        }

        public async Task SetOrderStatus(string email, int id, string status)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var order = _context.Orders.SingleOrDefault(x => x.UserId == user.Id && x.Id == id);
            if (order == null)
                throw new Exception("Error 'order' not found");

            var statusEntity = _context.OrderStatuses.SingleOrDefault(x => x.Name == status);
            if(statusEntity == null)
                throw new Exception("Error 'statusEntity' not found");

            order.OrderStatusId = statusEntity.Id;
            await _context.SaveChangesAsync();
        }
    }
}
