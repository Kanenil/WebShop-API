using ExamWebShop.Models.Account;
using ExamWebShop.Models.Products;

namespace ExamWebShop.Models.Users
{
    public class UserItemViewModel
    {
        public string Fullname { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
        public string Roles { get; set; }
        public List<BasketItemViewModel> Cart { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool Banned { get; set; }
        public string BannedTo { get; set; }
    }
}
