namespace ExamWebShop.Models.Orders
{
    public class CreateOrderViewModel
    {
        public List<CartItemViewModel> Products { get; set; }
    }

    public class CartItemViewModel
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public short Quantity { get; set; }
        public int DecreasePercent { get; set; }
    }
}
