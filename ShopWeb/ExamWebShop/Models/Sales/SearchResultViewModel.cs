
namespace ExamWebShop.Models.Sales
{
    public class SearchSaleResultViewModel
    {
        public List<SaleTableItemViewModel> Sales { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
