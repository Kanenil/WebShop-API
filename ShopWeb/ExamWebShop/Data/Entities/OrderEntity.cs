using ExamWebShop.Data.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamWebShop.Data.Entities
{
    [Table("tblOrders")]
    public class OrderEntity : BaseEntity<int>
    {
        [ForeignKey("OrderStatus")]
        public int OrderStatusId { get; set; }
        public virtual OrderStatusEntity OrderStatus { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual UserEntity User { get; set; }
        public virtual ICollection<OrderItemEntity> OrderItems { get; set; }
    }
}
