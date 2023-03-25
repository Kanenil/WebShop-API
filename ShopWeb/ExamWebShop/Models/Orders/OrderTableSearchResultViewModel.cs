namespace ExamWebShop.Models.Orders
{
    public class OrderTableSearchResultViewModel
    {
        public List<OrderTableItemViewModel> Orders { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
