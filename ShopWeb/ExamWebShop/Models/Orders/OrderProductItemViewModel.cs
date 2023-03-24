namespace ExamWebShop.Models.Orders
{
    public class OrderProductItemViewModel
    {
        public int Id { get; set; }
        public decimal PriceBuy { get; set; }
        public short Count { get; set; }
        public string ProductImage { get; set; }
        public string ProductName { get; set; }
        public string CategoryName { get; set; }
    }
}
