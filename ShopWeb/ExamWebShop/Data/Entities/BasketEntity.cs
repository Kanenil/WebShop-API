using ExamWebShop.Data.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamWebShop.Data.Entities
{
    [Table("tblBaskets")]
    public class BasketEntity
    {
        public short Count { get; set; }
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }

        public virtual ProductEntity Product { get; set; }
        public virtual UserEntity User { get; set; }
    }
}
