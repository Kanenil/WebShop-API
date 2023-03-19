using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Products;

namespace ExamWebShop.Interfaces
{
    public interface IProductsService
    {
        IQueryable<ProductEntity> Products { get; }
        Task<int> Create(CreateProductViewModel entity);
        Task Update(EditProductViewModel entity);
        Task<bool> Delete(int id);
        Task<int> AddImage(ProductImageEntity entity);
    }
}
