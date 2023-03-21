namespace ExamWebShop.Models.Sales
{
    public class SearchSaleViewModel
    {
        public int Page { get; set; } = 1;
        public string Search { get; set; }
        public int CountOnPage { get; set; } = 10;
    }
}
