namespace ExamWebShop.Models.Users
{
    public class UserSearchViewModel
    {
        public int Page { get; set; } = 1;
        public string Search { get; set; }
        public int CountOnPage { get; set; } = 10;
    }
}
