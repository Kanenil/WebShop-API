using ExamWebShop.Models.Products;

namespace ExamWebShop.Models.Account
{
    public class BasketItemViewModel
    {
        public int Count { get; set; }
        public ProductItemViewModel Product { get; set; }
    }
}
