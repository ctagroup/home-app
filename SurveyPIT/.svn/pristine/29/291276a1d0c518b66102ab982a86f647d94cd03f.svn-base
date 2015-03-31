using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Web;

namespace SurveyPIT.Models
{
    public class ResponseDTO : BaseResponse
    {
        public int SurveyId { get; set; }
        public int SurveyBy { get; set; }
        //public Client Client { get; set; }
        public class SurveyClient
        {
            public DateTime Birthday { get; set; }
            public GeoLocation GeoLoc { get; set; }
            public string Last4SSN { get; set; }
            public int ServicePointId { get; set; }
        }

        public SurveyClient Client { get; set; }
        //public class Response
        //{
        //    public int QuestionId { get; set; }
        //    public string Answer { get; set; }
        //}

        //public IEnumerable<Response> Responses { get; set; }
    }
    [TypeConverter(typeof(GeoLocationConverter))]
    public class GeoLocation
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public static bool TryParse(string s, out GeoLocation result)
        {
            result = null;

            var parts = s.Split(',');
            if (parts.Length != 2)
            {
                return false;
            }

            double latitude, longitude;
            if (double.TryParse(parts[0], out latitude) &&
                double.TryParse(parts[1], out longitude))
            {
                result = new GeoLocation() { Longitude = longitude, Latitude = latitude };
                return true;
            }
            return false;
        }
    }

    class GeoLocationConverter : TypeConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            if (sourceType == typeof(string))
            {
                return true;
            }
            return base.CanConvertFrom(context, sourceType);
        }

        public override object ConvertFrom(ITypeDescriptorContext context,
            CultureInfo culture, object value)
        {
            if (value is string)
            {
                GeoLocation loc;
                if (GeoLocation.TryParse((string)value, out loc))
                {
                    return loc;
                }
            }
            return base.ConvertFrom(context, culture, value);
        }
    }

    public abstract class BaseResponse
    {
        public class Response
        {
            public int QuestionId { get; set; }
            public string Answer { get; set; }
        }

        public IEnumerable<Response> Responses { get; set; }
    }

}
