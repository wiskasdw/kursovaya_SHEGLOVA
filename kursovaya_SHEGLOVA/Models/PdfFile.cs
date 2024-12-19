using System.ComponentModel.DataAnnotations;

namespace ISRPOLectures.Models
{
    public class PdfFile
    {
        [Key]
        public int Id { get; set; }

        public string? FileName { get; set; }

        public string? FilePath { get; set; }

        public DateTime UploadDate { get; set; }
    }
}