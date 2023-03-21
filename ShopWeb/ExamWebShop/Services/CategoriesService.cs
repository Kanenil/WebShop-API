using AutoMapper;
using ExamWebShop.Data;
using ExamWebShop.Data.Entities;
using ExamWebShop.Helpers;
using ExamWebShop.Interfaces;
using ExamWebShop.Models.Categories;

namespace ExamWebShop.Services
{
    public class CategoriesService : ICategoriesService
    {
        private readonly AppEFContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public CategoriesService(AppEFContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        public IQueryable<CategoryEntity> Categories => _context.Categories;

        public async Task<int> Create(CategoryCreateViewModel model)
        {
            if (model != null)
            {
                var entity = _mapper.Map<CategoryEntity>(model);
                _context.Categories.Add(entity);
                await _context.SaveChangesAsync();
                return entity.Id;
            }
            throw new Exception("Parameter 'entity' can not be null!");
        }

        public async Task<bool> Delete(int id)
        {
            var entity = _context.Categories.SingleOrDefault(x => x.Id == id);
            if (entity != null)
            {
                var data = _context.Categories.SingleOrDefault(p => p.Id == entity.Id);
                data.IsDeleted = true;
                await _context.SaveChangesAsync();
                return data.IsDeleted;
            }
            throw new Exception("In 'id' found 0 entities!");
        }

        public async Task Update(CategoryEditViewModel model)
        {
            if (model == null)
                throw new Exception("Parameter 'model' can not be null!");

            var data = _context.Categories.SingleOrDefault(x => x.Id == model.Id);

            if (!String.IsNullOrEmpty(data.Image) && data.Image != model.Image)
                ImageWorker.DeleteAllImages(data.Image, _configuration);

            data.Image = model.Image;
            data.Name = model.Name;
            await _context.SaveChangesAsync();
        }
    }
}
