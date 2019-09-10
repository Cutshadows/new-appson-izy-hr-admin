public IHttpActionResult FirebaseTest()
        {
            try
            {
                var user = _db.Users.FirstOrDefault(f => f.UserName == User.Identity.Name);
                if (user == null)
                {
                    return NotFound();
                }
                var data = new
                {
                    registration_ids = new {user.FirebaseToken},
                    priority = "high",
                    content_available = true,
                    notification = new
                    {
                       // message = "Mensaje personas no llegan a local",
                        title = "Notificacion Test",
                        body="Mensaje personas no llegan a local",
                        //seen = false,
                        sound = "Default",
                        //vibrate = "Default",
                        click_action = "FCM_PLUGIN_ACTIVITY",
                        icon="fcm_push_icon"
                    },
                    data =new 
                    {
                        id_sucursal:"2"
                        nom_sucursal:"IZYTECH DEMO 1 GPS"
                    }
                };
                return Ok(JObject.Parse(sendNotificationFirebase(data)));
            }
            catch (Exception ex)
            {
                return BadRequest(string.Format(MessageConstant.GetMessage(MessageIdentificator.UnexpectedError), ex.Message));
            }
        }

        string sendNotificationFirebase(object data)
        {
            var serializer = new JavaScriptSerializer();
            var json = serializer.Serialize(data);
            Byte[] byteArray = Encoding.UTF8.GetBytes(json);
           return  sendNotificationFirebase(byteArray);
        }
        string sendNotificationFirebase(Byte[] byteArray)
        {
            try
            {
                var gConfigs = _db.GeneralConfigs.ToList();
                string serverApiKey = gConfigs.Where(f => f.Key == "FirebaseApiKey").FirstOrDefault().Value;
                string sender_Id = gConfigs.Where(f => f.Key == "FirebaseSenderId").FirstOrDefault().Value;
                WebRequest tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
                tRequest.Method = "post";
                tRequest.ContentType = "application/json";
                tRequest.Headers.Add($"Authorization: key={serverApiKey}");
                tRequest.Headers.Add($"Sender: id={sender_Id}");
                tRequest.ContentLength = byteArray.Length;
                Stream dataStream = tRequest.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
                WebResponse tResponse = tRequest.GetResponse();
                dataStream = tResponse.GetResponseStream();
                StreamReader tReader = new StreamReader(dataStream);
                string sResponseFromServer = tReader.ReadToEnd();
                tReader.Close();
                dataStream.Close();
                tResponse.Close();
                return sResponseFromServer;
            }
            catch (Exception e)
            {
                return "error";
            }
        }