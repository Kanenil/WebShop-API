using ExamWebShop.Data.Entities.Identity;
using Google.Apis.Auth;

namespace ExamWebShop.Interfaces
{
    public interface IJwtTokenService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string tokenId);
        Task<string> CreateToken(UserEntity user);
    }
}
