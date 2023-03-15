using ExamWebShop.Constants;
using ExamWebShop.Helpers;
using ExamWebShop.Models.Upload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Imaging;

namespace ExamWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UploadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Upload([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image file was uploaded.");

            var fileName = ImageWorker.SaveImage(image, _configuration);

            return Ok(new UploadImageViewModel() { Image = fileName });
        }
    }
}
