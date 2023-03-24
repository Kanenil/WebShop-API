namespace ExamWebShop.Models.Orders
{
    public class OrderSearchResultViewModel
    {
        public List<OrderItemViewModel> Orders { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
