const fs = require('fs')
var CWebp = require('cwebp').CWebp;

const {
    createCanvas,
    loadImage,
    registerFont
} = require('canvas')
const cwebp = require('cwebp');

const {
    Client,
    MessageMedia
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const sharp = require('sharp');


function formatDate(date) {
    return `${date.toLocaleDateString('en-GB').replace(/(\/)/g,"_")}`

}

async function createAeroImage() {

    var fecha = new Date;
    var weekdays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

    var margin;
    const img = await loadImage('aero_template.jpg'); //Load cow template
    var canvas = createCanvas(img.width, img.height); //Create canvas with size of template
    var ctx = canvas.getContext('2d');
    registerFont('roboto.ttf', {
        family: 'Roboto'
    })

    ctx.roundRect = function (x, y, width, height, radius) { // roundRect function that allows us to create rectangles with border radius
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
    }


    ctx.drawImage(img, 0, 0, img.width, img.height); //Get the 2d context and draw the image to it
    ctx.font = '50px Roboto';


    var topTextDay = {
        innerText: `${weekdays[fecha.getDay()]}`,
        x: 680,
        y: 20,
    }
    var topTextDate = {
        innerText: `${fecha.toLocaleDateString('en-GB')}`,
        x: topTextDay.x,
        y: 20 + (ctx.measureText(topTextDay.innerText).emHeightAscent / 4 * 5.6),
    }
    topTextDate.x += ((ctx.measureText(topTextDay.innerText).width - ctx.measureText(topTextDate.innerText).width) / 2)
    ctx.font = '70px Roboto';

    var bottomTextDay = {
        innerText: `${weekdays[fecha.getDay()]}`,
        x: 10,
        y: 640,
    }
    bottomTextDay.x += 290 / (ctx.measureText(bottomTextDay.innerText).width) * 80

    var bottomTextDate = {
        innerText: `${fecha.toLocaleDateString('en-GB')}`,
        x: bottomTextDay.x,
        y: 640 + (ctx.measureText(bottomTextDay.innerText).emHeightAscent / 4 * 6),
    }
    bottomTextDate.x += ((ctx.measureText(bottomTextDay.innerText).width - ctx.measureText(bottomTextDate.innerText).width) / 2)

    var aeroText = {
        innerText: `aerodinámico`,
        x: 530,
        y: 700,
    }
    ctx.font = '50px Roboto';

    /*Upper day rectangle */

    margin = ctx.measureText(topTextDay.innerText).emHeightAscent / 5
    ctx.roundRect(topTextDay.x - margin * 2, topTextDay.y - margin, ctx.measureText(topTextDay.innerText).width + margin * 4, ctx.measureText(topTextDay.innerText).actualBoundingBoxAscent + ctx.measureText(topTextDay.innerText).emHeightDescent + margin * 2, 15)
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'alphabetic'
    ctx.fill()

    /*Upper date rectangle */

    margin = ctx.measureText(topTextDate.innerText).emHeightAscent / 4
    ctx.roundRect(topTextDate.x - margin, topTextDate.y - margin, ctx.measureText(topTextDate.innerText).width + margin * 2, ctx.measureText(topTextDate.innerText).actualBoundingBoxAscent + margin * 2, 15)
    ctx.fillStyle = 'black'
    ctx.fill()

    /*Context settings for text */


    /*Upper day text */
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'white'
    ctx.fillText(topTextDay.innerText, topTextDay.x, topTextDay.y - (ctx.measureText(topTextDay.innerText).emHeightAscent - ctx.measureText(topTextDay.innerText).actualBoundingBoxAscent))

    /*Upper date text */
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'white'
    ctx.fillText(topTextDate.innerText, topTextDate.x, topTextDate.y - (ctx.measureText(topTextDate.innerText).emHeightAscent - ctx.measureText(topTextDate.innerText).actualBoundingBoxAscent))

    /////////////////////////////////
    ctx.font = '65px Roboto';

    /*Bottom aerodynamic rectangle */
    ctx.textBaseline = 'alphabetic'

    margin = ctx.measureText(aeroText.innerText).emHeightAscent / 4
    ctx.roundRect(aeroText.x - margin * 27, aeroText.y - margin, ctx.measureText(aeroText.innerText).width + margin * 29, ctx.measureText(aeroText.innerText).actualBoundingBoxAscent + margin * 3, 20)
    ctx.fillStyle = '#060606'
    ctx.fill()


    ctx.font = '75px Roboto';

    /*Bottom day rectangle */
    ctx.textBaseline = 'alphabetic'
    margin = ctx.measureText(bottomTextDay.innerText).emHeightAscent / 5
    ctx.roundRect(bottomTextDay.x - margin * 2, bottomTextDay.y - margin, ctx.measureText(bottomTextDay.innerText).width + margin * 4, ctx.measureText(bottomTextDay.innerText).actualBoundingBoxAscent + ctx.measureText(bottomTextDay.innerText).emHeightDescent + margin * 2, 15)
    ctx.fillStyle = 'black'
    ctx.fill()

    /*Bottom date rectangle */

    margin = ctx.measureText(bottomTextDate.innerText).emHeightAscent / 4
    ctx.roundRect(bottomTextDate.x - margin, bottomTextDate.y - margin, ctx.measureText(bottomTextDate.innerText).width + margin * 2, ctx.measureText(bottomTextDate.innerText).actualBoundingBoxAscent + margin * 2, 15)
    ctx.fillStyle = 'black'
    ctx.fill()


    ctx.font = '65px Roboto';

    /*Bottom aerodynamic text */

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(aeroText.innerText, aeroText.x, aeroText.y - (ctx.measureText(aeroText.innerText).emHeightAscent - ctx.measureText(aeroText.innerText).actualBoundingBoxAscent))


    ctx.font = '75px Roboto';

    /*Bottom day text */

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(bottomTextDay.innerText, bottomTextDay.x, bottomTextDay.y - (ctx.measureText(bottomTextDay.innerText).emHeightAscent - ctx.measureText(bottomTextDay.innerText).actualBoundingBoxAscent))

    /*Bottom date text */

    ctx.textBaseline = 'top'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(bottomTextDate.innerText, bottomTextDate.x, bottomTextDate.y - (ctx.measureText(bottomTextDate.innerText).emHeightAscent - ctx.measureText(bottomTextDate.innerText).actualBoundingBoxAscent))


    ///////////////////////////////////////




    /*Save to file*/
    filename = `aero_image_${formatDate(fecha)}`
    return new Promise((resolve, reject) => {
        canvas.createPNGStream().pipe(sharp()
            .resize({
                width: 496
            })).pipe(fs.createWriteStream(`./temp_aero_files/${filename}.png`, {
            flags: "w"
        }).on('close', async function () {
            const img2 = await loadImage(`./temp_aero_files/${filename}.png`); //Load cow template

            var canvas2 = createCanvas(512, 512); //Create canvas with size of template
            var ctx2 = canvas2.getContext('2d');
            console.log(img2)
            ctx2.drawImage(img2, 8, ((512 - img2.height) / 2), img2.width, img2.height); //Get the 2d context and draw the image to it
            canvas2.createPNGStream().pipe(fs.createWriteStream(`./temp_aero_files/${filename}.png`, {
                    flags: "w"
                }))
                .on('close', function () {
                    CWebp(`./temp_aero_files/${filename}.png`).stream().pipe(fs.createWriteStream(`./aero_files/${filename}.webp`, {
                        flags: "w"
                    }).on('close', function () {
                        fs.rmSync(`./temp_aero_files/${filename}.png`)

                        resolve(`./aero_files/${filename}.webp`)
                    }));

                })
        }))
    })

}




async function main() {
    const SESSION_FILE_PATH = './session.json';
    let sessionData;
    if (fs.existsSync(SESSION_FILE_PATH)) {
        sessionData = require(SESSION_FILE_PATH);
    }

    const client = new Client({
        session: sessionData
    });

    client.on('ready', () => {
        console.log('Client is ready');
        var now = new Date();
        var ms_to_midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 2, 0) - now;
        console.log(`Se va a esperar --> ${ms_to_midnight} milisegundos, es decir se ejecutará la función a las ${new Date (Date.now() + ms_to_midnight)}`)
        setTimeout(function () {
            console.log("Empezando ciclo de 24 horas")
            setInterval(daily_sticker(), 86400000);
        }, (ms_to_midnight));
    });

    client.on('authenticated', (session) => {
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    client.on('qr', qr => {
        qrcode.generate(qr, {
            small: true
        });
    });

    client.on('message', message => {
        console.log(message.body);

        if (message.body.includes('sticker')) {
            console.log("testing");
            console.log(message)

        }
    });


    function daily_sticker() {
        console.log("Sending sticker")

        createAeroImage().then(function (result) {
            var sticker = MessageMedia.fromFilePath(result)
            client.sendMessage("34604052393-1598193769@g.us", sticker, {
                sendMediaAsSticker: true
            })
        });
    }





    client.initialize();

}
createAeroImage()