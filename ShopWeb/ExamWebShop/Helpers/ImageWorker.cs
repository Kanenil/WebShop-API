using Microsoft.Extensions.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net;

namespace ExamWebShop.Helpers
{
    public static class ImageWorker
    {
        public static string SaveImage(IFormFile image, IConfiguration configuration)
        {
            var bmp =IFormFileToBitmap(image);
            var fileName = Path.GetRandomFileName() + ".jpg";
            string[] imageSizes = ((string)configuration.GetValue<string>("ImageSizes")).Split(" ");
            Save(bmp, fileName, imageSizes);
            return fileName;
        }
        public static string SaveImage(string url, IConfiguration configuration)
        {
            var bmp = URLToBitmap(url);
            var fileName = Path.GetRandomFileName() + ".jpg";
            string[] imageSizes = ((string)configuration.GetValue<string>("ImageSizes")).Split(" ");
            Save(bmp, fileName, imageSizes);
            return fileName;
        }
        private static void Save(Bitmap bmp, string fileName, string[] sizes) 
        {
            foreach (var imageSize in sizes)
            {
                int size = int.Parse(imageSize);
                string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}x{size}_{fileName}");
                var saveImage = CompressImage(bmp, size, size);
                saveImage.Save(dirSaveImage, ImageFormat.Jpeg);
            }
        }
        private static Bitmap IFormFileToBitmap(IFormFile file)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                file.CopyTo(ms);
                ms.Position = 0;
                Image img = Image.FromStream(ms);
                ms.Close();
                return new Bitmap(img);
            }
        }
        private static Bitmap CompressImage(Bitmap originalPic, int maxWidth, int maxHeight, bool transperent = false)
        {
            try
            {
                int width = originalPic.Width;
                int height = originalPic.Height;
                int widthDiff = width - maxWidth;
                int heightDiff = height - maxHeight;
                bool doWidthResize = (maxWidth > 0 && width > maxWidth && widthDiff > heightDiff);
                bool doHeightResize = (maxHeight > 0 && height > maxHeight && heightDiff > widthDiff);

                if (doWidthResize || doHeightResize || (width.Equals(height) && widthDiff.Equals(heightDiff)))
                {
                    int iStart;
                    Decimal divider;
                    if (doWidthResize)
                    {
                        iStart = width;
                        divider = Math.Abs((Decimal)iStart / maxWidth);
                        width = maxWidth;
                        height = (int)Math.Round((height / divider));
                    }
                    else
                    {
                        iStart = height;
                        divider = Math.Abs((Decimal)iStart / maxHeight);
                        height = maxHeight;
                        width = (int)Math.Round(width / divider);
                    }
                }
                using (Bitmap outBmp = new Bitmap(width, height, PixelFormat.Format24bppRgb))
                {
                    using (Graphics oGraphics = Graphics.FromImage(outBmp))
                    {
                        oGraphics.Clear(Color.White);
                        oGraphics.DrawImage(originalPic, 0, 0, width, height);

                        if (transperent)
                        {
                            outBmp.MakeTransparent();
                        }

                        return new Bitmap(outBmp);
                    }
                }
            }
            catch
            {
                return null;
            }
        }
        private static Bitmap URLToBitmap(string url)
        {
            using (var client = new WebClient())
            {
                using (var stream = client.OpenRead(url))
                {
                    return new Bitmap(stream);
                }
            }
        }
        public static void DeleteAllImages(string fileName, IConfiguration configuration)
        {
            try
            {
                string[] imageSizes = ((string)configuration.GetValue<string>("ImageSizes")).Split(" ");
                foreach (var imageSize in imageSizes)
                {
                    int size = int.Parse(imageSize);
                    string dirRemoveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}x{size}_{fileName}");
                    System.IO.File.Delete(dirRemoveImage);
                }
            }
            catch (Exception)
            {

            }
        }
    }
}
