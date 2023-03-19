namespace ExamWebShop.Models.Products
{
    public class ProductSearchResultViewModel
    {
        public List<ProductItemViewModel> Products { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
