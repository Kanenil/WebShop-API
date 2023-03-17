using AutoMapper;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Auth;
using ExamWebShop.Models.Categories;
using ExamWebShop.Models.Products;

namespace ExamWebShop.Mapper
{
    public class AppMapProfile : Profile
    {
        public AppMapProfile()
        {
            CreateMap<RegisterViewModel, UserEntity>()
                .ForMember(x => x.UserName, dto => dto.MapFrom(x => x.Email));
            CreateMap<CategoryEntity, CategoryItemViewModel>();
            CreateMap<CategoryCreateViewModel, CategoryEntity>();
            CreateMap<ProductEntity, ProductItemViewModel>()
                .ForMember(x => x.Category, dto => dto.MapFrom(x => x.Category.Name))
                .ForMember(x => x.Images, dto => dto.MapFrom(x => x.Images.Select(x => x.Name)));
            CreateMap<CreateProductViewModel, ProductEntity>().ForMember(x => x.Images, opt => opt.Ignore());
            CreateMap<CategoryEntity, CategoryMainItemViewModel>()
                .ForMember(x => x.CountProducts, opt => opt.MapFrom(x => x.Products.Count));
        }
    }
}
