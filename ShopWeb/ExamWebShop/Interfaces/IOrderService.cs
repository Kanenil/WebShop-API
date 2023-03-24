using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Account;
using ExamWebShop.Models.Orders;

namespace ExamWebShop.Interfaces
{
    public interface IOrderService
    {
        Task<OrderSearchResultViewModel> GetOrdersAsync(string email, OrderSearchViewModel search);
        Task<OrderItemViewModel> GetOrderAsync(string email, int id);
        Task SetOrderStatus(string email, int id, string status);
        Task MakeOrderAsync(string email, CreateOrderViewModel model);
    }
}
