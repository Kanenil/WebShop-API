using AutoMapper;
using ExamWebShop.Data.Entities.Identity;
using ExamWebShop.Models.Auth;

namespace ExamWebShop.Mapper
{
    public class AppMapProfile : Profile
    {
        public AppMapProfile()
        {
            CreateMap<RegisterViewModel, UserEntity>()
                .ForMember(x => x.UserName, dto => dto.MapFrom(x => x.Email));
        }
    }
}
