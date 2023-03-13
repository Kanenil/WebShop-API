using AutoMapper;
using ExamWebShop.Data.Entities;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Auth;
using ExamWebShop.Models.Categories;

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
        }
    }
}
