namespace ExamWebShop.Models.Orders
{
    public class OrderTableItemViewModel
    {
        public int Id { get; set; }
        public string OrderStatus { get; set; }
        public IList<OrderProductItemViewModel> Products { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
    }
}
