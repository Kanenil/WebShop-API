using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Orders;

namespace ExamWebShop.Interfaces
{
    public interface IOrderService
    {
        IQueryable<OrderStatusEntity> OrderStatuses { get; }
        Task<OrderSearchResultViewModel> GetOrdersAsync(string email, OrderSearchViewModel search);
        Task<OrderTableSearchResultViewModel> GetOrdersAsync(OrderSearchViewModel search);
        Task<OrderItemViewModel> GetOrderAsync(string email, int id);
        Task SetOrderStatus(string email, int id, string status);
        Task MakeOrderAsync(string email, CreateOrderViewModel model);
    }
}
