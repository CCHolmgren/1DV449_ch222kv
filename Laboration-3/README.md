1. Vad finns det för krav du måste anpassa dig efter i de olika API:erna?
SRs API tillåter inte CORS, vilket inte är ett problem i det här fallet, men det kan vara jobbigt i andra fall eftersom man då måste använda en egen server som en proxy för att det ska fungera. I det här fallet så var det ju tanken att man både skulle cacha och inte använda JSONP, men det hade varit händigt att kunna göra det och använda någon form utav localstorage lösning eller liknande istället för en dedikerad server eftersom den gör så lite.

2. Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?
Jag sätter en max-age på 1000 sekunder via serve-statics setHeaders. På detta sätt så kommer webbläsaren inte att läsa in filen igen inom ~17 minuter. Tiden är väldigt arbiträr och man kan säkerligen sätta den mycket högre, men eftersom applikationen på något sätt ska kunna förmedla "nutidsinformations" så valde jag att sätta den till 1000 sekunder eftersom jag fann det till en ganska bra kompromiss.

3. Vad finns det för risker med din applikation?
Risker? Om SR beslutar sig för att skicka HTML taggar i sina meddelanden så blir det kanske jobbigt, men jag escapar meddelanden så att det inte borde göra något. Risken är ju alltid att de ändrar sitt API eller skickar något meddelanden som är konstruerat på ett sätt som tillåter dumma saker att ske.

4. Hur har du tänkt kring säkerheten i din applikation?

5. Hur har du tänkt kring optimeringen i din applikation?
Jag har använt YSLOW, vilket inte indikerade på några problem annat än saker som har med Google Maps APIet, vilket jag inte har någon riktig makt över.