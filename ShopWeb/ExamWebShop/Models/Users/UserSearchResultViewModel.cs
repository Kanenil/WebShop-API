namespace ExamWebShop.Models.Users
{
    public class UserSearchResultViewModel
    {
        public List<UserItemViewModel> Users { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
