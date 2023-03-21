using ExamWebShop.Data.Entities;
using ExamWebShop.Models.Categories;

namespace ExamWebShop.Interfaces
{
    public interface ICategoriesService
    {
        IQueryable<CategoryEntity> Categories { get; }
        Task<int> Create(CategoryCreateViewModel entity);
        Task Update(CategoryEditViewModel entity);
        Task<bool> Delete(int id);
    }
}
