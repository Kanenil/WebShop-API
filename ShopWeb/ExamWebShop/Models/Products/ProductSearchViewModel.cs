namespace ExamWebShop.Models.Products
{
    public class ProductSearchViewModel
    {
        public int Page { get; set; } = 1;
        public string Search { get; set; }
        public string Category { get; set; }
        public string Sort { get; set; }
        public int CountOnPage { get; set; } = 10;
    }
}
