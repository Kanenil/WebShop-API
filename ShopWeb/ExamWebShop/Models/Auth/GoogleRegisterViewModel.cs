using System.ComponentModel.DataAnnotations;

namespace ExamWebShop.Models.Auth
{
    public class GoogleRegisterViewModel
    {
        [Required]
        public string Token { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Image { get; set; }
    }
}
