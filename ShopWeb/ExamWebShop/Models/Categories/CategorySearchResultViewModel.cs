
namespace ExamWebShop.Models.Categories
{
    public class CategorySearchResultViewModel
    {
        public List<CategoryItemViewModel> Categories { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
