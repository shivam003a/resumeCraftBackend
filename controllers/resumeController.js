const PDFDocument = require('pdfkit');
const fs = require('fs');
const User = require('../models/userSchema')


const resume = async (req, res) => {
    try {
        // user details
        const user = await User.findById(req.user.id).select('-password').select('-token');

        // pdf configurations
        const doc = new PDFDocument({
            size: "A4",
            margin: 36,
            lineGap: 14
        });
        const stream = doc.pipe(fs.createWriteStream('resume.pdf'));
        doc.lineGap(2);

        // month indexing useful later
        const monthIndex = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        };

        // font configuration
        const cambriaRegular = fs.readFileSync('./Cambria/cambria.ttf');
        const cambriaBold = fs.readFileSync('./Cambria/cambria-bold.ttf');
        doc.registerFont('Cambria', cambriaRegular);
        doc.registerFont('Cambria-Bold', cambriaBold);

        // header
        const textWidth = doc.widthOfString(`${user.name} | ${user.mobile} | ${user.linkedin}`);
        const indexX = (doc.page.width - 72 - textWidth) / 2;
        doc.font('Cambria-Bold').fontSize(22).text(`${user.name}`, { align: 'center' });

        const mail = `mailto:${user.email}`;
        const phone = `tel:${user.mobile}`;
        const linkedin = user.linkedin;

        doc.fontSize(11).text(`${user.email}`, {
            continued: true,
            link: mail,
            underline: true,
            indent: indexX
        });
        doc.fontSize(11).text(' | ', {
            continued: true,
            underline: false,
            link: null
        });
        doc.fontSize(11).text(`${user.mobile}`, {
            continued: true,
            link: phone,
            underline: true
        });
        doc.fontSize(11).text(' | ', {
            continued: true,
            underline: false,
            link: null
        });
        doc.fontSize(11).text(`${user.linkedin}`, {
            link: linkedin,
            underline: true
        });

        doc.moveTo(0, doc.y + 3)
            .lineTo(doc.page.width, doc.y + 3)
            .stroke();
        doc.moveDown(0.6);
        // header ends here


        // experience
        doc.font('Cambria-Bold').fontSize(13).text('EXPERIENCE');
        const eDetails = user.eDetails

        eDetails.forEach((e) => {
            doc.font('Cambria-Bold').fontSize(11).text(`${e.eTitle}: ${e.eCom}`, { continued: true });

            const newDateFrom = new Date(e.eFromDate)
            const monthFrom = newDateFrom.getMonth() + 1;
            const monthInStringFrom = monthIndex[monthFrom]
            const yearFrom = newDateFrom.getFullYear();
            const dateFrom = `${monthInStringFrom} ${yearFrom}`

            let dateTill = ""
            if (e.eTillDate === "") {
                dateTill = "Present"
            }
            else {
                const newDateTill = new Date(e.eTillDate)
                const monthTill = newDateTill.getMonth() + 1;
                const monthInStringTill = monthIndex[monthTill]
                const yearTill = newDateTill.getFullYear();
                dateTill = `${monthInStringTill} ${yearTill}`
            }

            doc.font('Cambria-Bold').fontSize(11).text(`${dateFrom} – ${dateTill}`, {
                align: 'right'
            });
            const expBullet = [e.eBullet1, e.eBullet2, e.eBullet3]
            doc.font('Cambria').fontSize(11).list(expBullet, {
                bulletRadius: 2,
                align: 'justify'
            })
        })

        doc.moveTo(doc.page.margins.left, doc.y + 3)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
            .stroke();
        doc.moveDown(0.6);
        // experience here here


        // education
        doc.font('Cambria-Bold').fontSize(13).text('EDUCATION');
        const eduDetails = user.eduDetails

        eduDetails.forEach((edu) => {
            doc.font('Cambria-Bold').fontSize(11).text(edu.eduTitle, { continued: true });

            const newDateFrom = new Date(edu.eduFromDate)
            const monthFrom = newDateFrom.getMonth() + 1;
            const monthInStringFrom = monthIndex[monthFrom]
            const yearFrom = newDateFrom.getFullYear();
            const dateFrom = `${monthInStringFrom} ${yearFrom}`

            let dateTill = ""
            if (edu.eduTillDate === "") {
                dateTill = "Present"
            }
            else {
                const newDateTill = new Date(edu.eduTillDate)
                const monthTill = newDateTill.getMonth() + 1;
                const monthInStringTill = monthIndex[monthTill]
                const yearTill = newDateTill.getFullYear();
                dateTill = `${monthInStringTill} ${yearTill}`
            }


            doc.font('Cambria-Bold').fontSize(11).text(`${dateFrom} - ${dateTill}`, {
                align: 'right'
            });
            doc.font('Cambria').fontSize(11).text(`${edu.eduCourse}: ${edu.eduMajor}, ${edu.eduMarks}`);
        })

        doc.moveTo(doc.page.margins.left, doc.y + 3)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
            .stroke();
        doc.moveDown(0.6);
        // education ends here

        // skills
        doc.font('Cambria-Bold').fontSize(13).text('SKILLS');
        // from db
        const skills = user.skills
        const availSpace = (doc.page.width - 72) / 3;
        let aX = 36
        let aY = doc.y
        let tempY;
        let temp = aY
        for (let i = 0; i < skills.length; i++) {
            doc.font('Cambria').fontSize(11).text(skills[i], aX, aY);
            if (i == 3) {
                aX += availSpace;
                aY = temp;
                tempY = doc.y
            }
            else if (i == 7) {
                aX += availSpace;
                aY = temp;
            }
            else aY += 14;
        }

        if(!tempY){
            tempY = doc.y
        }
        
        doc.moveTo(doc.page.margins.left, tempY + 3)
        .lineTo(doc.page.width - doc.page.margins.right, tempY + 3)
        .stroke();
        doc.moveDown(0.6);
        // skills end here

        // Projects section
        doc.font('Cambria-Bold').fontSize(13).text('PROJECTS', 36, tempY+10);
        const pDetails = user.pDetails
        pDetails.forEach((p) => {
            doc.font('Cambria-Bold').fontSize(11).text(p.pTitle, {
                link: p.pLink,
                continued: true,
                underline: true,
            });

            const newDateFrom = new Date(p.pFromDate)
            const monthFrom = newDateFrom.getMonth() + 1;
            const monthInStringFrom = monthIndex[monthFrom]
            const yearFrom = newDateFrom.getFullYear();
            const dateFrom = `${monthInStringFrom} ${yearFrom}`

            let dateTill = ""
            if (p.pTillDate === "") {
                dateTill = "Present"
            }
            else {
                const newDateTill = new Date(p.pTillDate)
                const monthTill = newDateTill.getMonth() + 1;
                const monthInStringTill = monthIndex[monthTill]
                const yearTill = newDateTill.getFullYear();
                dateTill = `${monthInStringTill} ${yearTill}`
            }

            doc.font('Cambria-Bold').fontSize(11).text(`${dateFrom} – ${dateTill}`, {
                align: 'right',
                link: null,
                underline: false
            });
            const vidnexaBullet = [p.pBullet1, p.pBullet2, p.pBullet3]
            doc.font('Cambria').fontSize(11).list(vidnexaBullet, {
                bulletRadius: 2,
                align: 'justify'
            });
        })

        doc.moveTo(doc.page.margins.left, doc.y + 3)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
            .stroke();
        doc.moveDown(0.6);
        // project ends here


        // Certifications section
        doc.font('Cambria-Bold').fontSize(13).text('CERTIFICATIONS');
        const certifications = user.certificateDetails

        certifications.forEach((cer) => {
            doc.font('Cambria').fontSize(11).text(`${cer.certificateTitle}, ${cer.certificateIssuer}`, { continued: true });

            const newDate = new Date(cer.certificateDate)
            const month = newDate.getMonth() + 1;
            const monthInString = monthIndex[month]
            const year = newDate.getFullYear();
            const date = `${monthInString} ${year}`

            doc.font('Cambria').fontSize(11).text(date, {
                align: 'right'
            });
        })
        
        doc.moveTo(doc.page.margins.left, doc.y + 3)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
        .stroke();
        doc.moveDown(0.6);
        // Certifications Section Ends

        // Coding Profiles section
        doc.font('Cambria-Bold').fontSize(13).text('CODING PROFILES');
        const codingProfiles = user.codingDetails
        codingProfiles.forEach((cp) => {
            doc.font('Cambria').fontSize(11).text(cp.codingTitle, {
                link: cp.codingLink
            })
        })
        // Coding Profiles End

        doc.end();
        stream.on('finish', () => {
            res.status(200).sendFile('resume.pdf', { root: "../backend" });
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
};

module.exports = resume;