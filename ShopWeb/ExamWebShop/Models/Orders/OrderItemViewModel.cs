namespace ExamWebShop.Models.Orders
{
    public class OrderItemViewModel
    {
        public int Id { get; set; }
        public string OrderStatus { get; set; }
        public IList<OrderProductItemViewModel> Products { get; set; }
    }
}
