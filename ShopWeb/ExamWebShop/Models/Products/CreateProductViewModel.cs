using System.ComponentModel.DataAnnotations;

namespace ExamWebShop.Models.Products
{
    public class CreateProductViewModel
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public List<string> Images { get; set; }
    }
}
