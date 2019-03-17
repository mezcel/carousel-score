/* Slideshow Script */

var colorCounter = 0; // initial backgorund color

/* change background color on each station */
function transitionColor(colorCounter) {
	
	var colors=["white", "#f2f2f2","#e6e6e6","#d9d9d9","#cccccc","#bfbfbf","#b3b3b3","#a6a6a6","#999999","#8c8c8c","#808080","#737373","#666666","#595959","#595959","#595959"];

	var textColor=["black","black","black","black","black","black","black","black","black","black","black","#cccccc","#d9d9d9","#e6e6e6","#f2f2f2"];

	$('#stationLabel').toggleClass('colorTransition');
	$("#stationLabel").toggleClass('transitionText');

	setTimeout(function(){
		$('.colorTransition').css("background-color", colors[colorCounter]);
		$('.transitionText').css("color", textColor[colorCounter]);

		
		$('#stationLabel').removeClass('colorTransition');
		$("#stationLabel").removeClass('transitionText');
	}, 1500)  
}
             
var imgCounter = -2; //i dont need the 1st 2 in sequence

var divideImgIntoSegmentsSmall = function() {
    var myImgPxX, myImgPxY, col, row;
    myImgPxX = 25;
    changeinPx = 134;
    myImgPxY = 39;
    changeinPy = 165;
    for (col = 0; col < 4; col += 1) {
        for (row = 0; row < 4; row += 1) {
            $("<style>").prop("type", "text/css").html(".station" + imgCounter + "{background-position: -" + (myImgPxX + (row * changeinPx)) + "px -" + (myImgPxY + (col * changeinPy)) + "px;}").appendTo("head");
            imgCounter += 1;
        }
    }
};

/* Chop 1 big img into smaller imgs */
var divideImgIntoSegmentsLarge = function() {
    var myImgPxX, myImgPxY, col, row;
    myImgPxX = 125;
    changeinPx = 600;
    myImgPxY = 168;
    changeinPy = 750;
    for (col = 0; col < 4; col += 1) {
        for (row = 0; row < 4; row += 1) {
            $("<style>").prop("type", "text/css").html(".station" + imgCounter + "{background-position: -" + (myImgPxX + (row * changeinPx)) + "px -" + (myImgPxY + (col * changeinPy)) + "px;}").appendTo("head");
            imgCounter += 1;
        }
    }
};

/* Used for: <ol class="carousel-indicators"></ol> */
var carouselOrderList = function() {
    var i;
    $("ol").append("<li data-target='#myCarousel' data-slide-to='0' class='item0 active' onclick='stopAtStation(1); transitionColor(1)'></li>"); //initializer
    for (i = 1; i < imgCounter; i += 1) {
        $("ol").append("<li data-target='#myCarousel' data-slide-to='" + i + "' class='item" + i + "' onclick='stopAtStation(" + (i + 1) + " ); transitionColor(" + (i+1) + ")'></li>");
    }
}

/* Used for: <div id="myListbox" class="carousel-inner" role="listbox"></div> */
var myLisboxDivs = function() {
    var i;
    $("#myListbox").append("<div class='item active'><div class='mystery station0 center-block'></div></div>");
    for (i = 1; i < imgCounter; i += 1) {
        $("#myListbox").append("<div class='item'><div class='mystery station" + i + " center-block'></div></div>");
    }
}

var carouselIndicators = function() {
    var i, tempClassName;
    for (i = 0; i < imgCounter; i += 1) {
        tempClassName = ".item" + i;
        $(tempClassName).click(function() {
            $("#myCarousel").carousel(i);
        });
    }
};

var slideCounter = 0; // initialize station sequence to 0

$(document).ready(function() {
    //watch for screen size changes
    if ($(window).height() < 1300) {
        divideImgIntoSegmentsSmall();
        carouselOrderList();
        myLisboxDivs(); // wraped div imgs
        carouselIndicators(); // Enable Carousel Indicators
    } else {
        divideImgIntoSegmentsLarge();
        carouselOrderList();
        myLisboxDivs(); // wraped div imgs
        carouselIndicators(); // Enable Carousel Indicators
    }
    
    /*$(document).on('mouseleave', '.carousel', function() {
        $(this).carousel('pause');
    });*/

    // Enable Carousel Controls
    $(".left").click(function() {
        $("#myCarousel").carousel("prev");
        if (slideCounter > 1) {
            slideCounter -= 1;
        } else {
            slideCounter = 14;
        }
        stopAtStationRev(slideCounter);
        transitionColor(slideCounter);
    });

    $(".right").click(function() {
        $("#myCarousel").carousel("next");
        if (slideCounter < 14) {
            slideCounter += 1;
        } else {
            slideCounter = 1;
        }
        stopAtStation(slideCounter);
        transitionColor(slideCounter);
    });

    $("#toggleSoundDisplay").click(function() {
        $("#soundClips").toggle();
        
        $("#stationLabel").toggle();
        $("#readings").toggle();
    });
    $("#soundClips").toggle(); //initially hide audio clips

    makeMyAudioMixingTable(); //generate html audio tag playlist

    $(".audioDemo").trigger('load'); //load the audio
    $(".audioDemo").bind("load", function() {
        $(".alert-success").html("Audio Loaded succesfully");
    });

    startAll(); //initialize and begin
});

var audioStemsArray = [
    "-",
    "myAssets/audio/390421__mezcel__123882-calpomatt-lostsouls-mezcelized.mp3",
    "myAssets/audio/390419__mezcel__207127-ahill86-gravelcrunch-mezcelized.mp3",
    "myAssets/audio/390420__mezcel__150954-unchaz-angry-mob-mezcelized.mp3",
    "myAssets/audio/390425__mezcel__249716-daandraait-slow-heartbeat-mezcelized.mp3",
    "myAssets/audio/390424__mezcel__254366-harrybates01-heartbeat-fast-mezcelized.mp3",
    "myAssets/audio/390423__mezcel__336997-corsica-s-boo-01-mezcelized.mp3",
    "myAssets/audio/346932__dav0r__breathing-male.mp3",
    "myAssets/audio/174877__sclolex__a-bad-day-at-the-crypt.mp3",
    "myAssets/audio/390422__mezcel__123882-calpomatt-lostsouls-lowpass-mezcelized.mp3"
]; // 0, 1-9

/* Fader effects variables */
// this variable is a temporary container for volume related meta pulled from the stationJSON var
var fadeAutomation = [];

/* JSON database var */
/* This database contains all the instructions to be performed on a specific station */
var stationJSON = [
        {
            "stationID":0, "stationNo":0, "stationName":"-", "scriptures":"-",
                "statioAutomation":[
                    {"fadetrack":0, "fadeFinal":0, "fadeRate":0, "fadeDirection":1}
                ]
        },
        {
            "stationID":1, "stationNo":1, "stationName":"Jesus is condemned to death", "scriptures":"<p>Again the high priest asked him and said to him, \“Are you the Messiah, the son of the Blessed One?\” Then Jesus answered, \“I am; and ‘you will see the Son of Man seated at the right hand of the Power and coming with the clouds of heaven.’\” At that the high priest tore his garments and said, \“What further need have we of witnesses? You have heard the blasphemy. What do you think?\” They all condemned him as deserving to die. (Mark 14:61-64) <\/p><p>The kings of the earth rise up<br> and the princes conspire together against the Lord and against his Anointed.<br>I will proclaim the decree of the Lord;<br>the Lord said to me:<br>\"You are my Son; this day I have begotten you.<br>Ask of me and l will give you the nations for an inheritance<br>and the ends of the earth for your possession.\" (Psalm 2, 2 & 7-8)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* pad regular */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.3, "fadeRate":1000, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* boos */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":100, "fadeDirection":1} /* pads lo-pass*/
                ]
        },
        {
            "stationID":2, "stationNo":2, "stationName":"Jesus carries His Cross", "scriptures":"<p>And Pilate said to the Jews, \"Behold, your king!\" But they cried out, \"Away with him! Away with him! Crucify him!\" Pilate said to them, \"Shall I crucify your king?\" The chief priests answered, \"We have no king but Caesar.\" Then he handed him over to them to be crucified. And so they took Jesus and led him away, bearing the cross for himself. (John 19:14-17)<\/p><p>Who would believe what we have heard?<br>To whom has the arm of the Lord been revealed?<br>He grew up like a sapling before him, like a shoot from the parched earth,<br>there was in him no stately bearing to make us look at him,<br>no appearance that would attract us to him.<br>He was rejected and avoided by men,<br>a man of suffering, accustomed to infirmity,<br>one of those from whom men turn away,<br>and we held him in no esteem. (Is. 53:1-3)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":.8, "fadeRate":1000, "fadeDirection":1}, /* pad regular */
                    {"fadetrack":2, "fadeFinal":.3, "fadeRate":800, "fadeDirection":1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.4, "fadeRate":500, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":.2, "fadeRate":1500, "fadeDirection":1}, /* boos */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":100, "fadeDirection":1} /* pads lo-pass*/
                ]
        },
        {
            "stationID":3, "stationNo":3, "stationName":"Jesus falls the first time", "scriptures":"<p>If the world hates you, know that it has hated me before you. If you were of the world, the world would love what is its own. Because you are not of the world, but I have chosen you out of the world, therefore the world hates you. Remember the word that I have spoken to you: No servant is greater than his master. If they have persecuted me, they will persecute you also. (John 15:18-20)<\/p><p>Why are your clothes red,<br> and your garments like those of the wine presser?<br> \"The wine press I have trodden alone,<br> and of my people there was no one with me.<br> I trod them in my anger, and trampled them down in my wrath;<br> their blood spurted on my garments and I stained all my clothes.<br> I looked about, but there was no one to help,<br> I was appalled that there was no one to lend support;<br> so my own arm brought about the victory.\" (Is. 63:2-5)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":150, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.3, "fadeRate":100, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.6, "fadeRate":150, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":50, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":1, "fadeRate":200, "fadeDirection":1} /* lo-pass pads */
                ]
        },
        {
            "stationID":4, "stationNo":4, "stationName":"Jesus meets his afflicted mother", "scriptures":"<p>Now there were standing by the cross of Jesus his mother and his mother's sister, Mary of Cleophas, and Mary Magdalene. When Jesus, therefore, saw his mother and the disciple standing by, whom he loved, he said to his mother, \"Woman, behold, your son.\" Then he said to the disciple, \"Behold, your mother.\" And from that hour the disciple took her into his home. (John 19:25-27)<\/p> <p>To what can I compare you, O daughter Jerusalem?<br> What example can I show you for your comfort,<br> Virgin daughter Sion?<br> For great as the sea is your distress:<br> who can heal you? (Lam. 2:13)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":.1, "fadeRate":200, "fadeDirection":1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":10, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.1, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.5, "fadeRate":100, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":1, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":50, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":.1, "fadeRate":100, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":5, "stationNo":5, "stationName":"Simon of Cyrene helps Jesus carry His Cross", "scriptures":"<p>And when they had mocked Jesus, they took the purple cloak off and put his own clothes on him and they led him out to be crucified. Then they forced a certain passer-by, Simon of Cyrene, coming from the country, to  up his cross. They brought Jesus to the place called Golgotha, a name meaning \"the place of the skull.\" (Mt. 15:20-22)<\/p> <p>With a loud voice I cry out to the Lord <br> with a loud voice I beseech the Lord<br> My complaint I pour out before him;<br> before him I lay bare my distress.<br> When my spirit is faint within me you know my path.<br> In the way along which I walk they have hid a trap for me.<br> I look to the right to see, but there is no one who pays me heed<br> I have lost all means of escape;<br> there is no one who cares for my life. (Ps. 141:2-5)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":.4, "fadeRate":300, "fadeDirection":1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":10, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.5, "fadeRate":100, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":500, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.5, "fadeRate":100, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":50, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":.1, "fadeRate":300, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":200, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":6, "stationNo":6, "stationName":"Veronica wipes the face of Jesus", "scriptures":"<p>\"Lord, when did we see you hungry, and feed you; or thirsty, and give you drink? And when did we see you a stranger, and take you in; or naked, and clothe you? Or when did we see you sick, or in prison, and come to you?\" And answering the king will say to them, \"Amen, I say to you, as long as you did it for one of these, the least of my brethren, you did it for me.\" (Mt. 25:37-40)<\/p> <p>A faithful friend is a sturdy shelter;<br> he who finds one finds a treasure.<br> A faithful friend is beyond price, no sum can balance his worth.<br> A faithful friend is a life-saving remedy, such as he who fears God finds;<br> for he who fears God behaves accordingly,<br> and his friend will be like himself. (Sirach 6:14-17)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":.5, "fadeRate":200, "fadeDirection":1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":10, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.1, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.4, "fadeRate":100, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":.1, "fadeRate":250, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":.2, "fadeRate":100, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":7, "stationNo":7, "stationName":"Jesus falls the second time", "scriptures":"<p>It was our weaknesses that he carried, our sufferings that he endured, while we thought of him as stricken, as one struck by God and afflicted. But he was pierced for our offenses, crushed for our sins; upon him was the punishment that makes us whole, by his stripes we were healed. We had all gone astray like sheep, each following his own way; but the Lord laid upon him the guilt of us all. (Is. 53:4-6)<\/p> <p>Though he was harshly treated,<br> he submitted and opened not his mouth;<br> like a Lamb led to the slaughter or a sheep before the shearers,<br> he was silent and uttered no cry.<br> When he was cut off from the land of the living, and smitten for the sin of His people,<br> a grave was assigned him among the wicked and a burial place with evildoers,<br> though he had done no wrong nor spoken any falsehood. (Is. 53:7,9)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":200, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.6, "fadeRate":100, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.2, "fadeRate":300, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":300, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.1, "fadeRate":150, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":.5, "fadeRate":200, "fadeDirection":1} /* lo-pass pads */
                ]
        },
        {
            "stationID":8, "stationNo":8, "stationName":"Jesus meets the women of Jerusalem", "scriptures":"<p>There was following Jesus a great crowd of people, and among them were some women who were bewailing and lamenting him. Jesus turning to them said, \"Daughters of Jerusalem, do not weep for me but weep for yourselves and for your children.\" (Luke 23:27-28)<\/p> <p>Come, all you who pass by the way,<br> look and see whether there is any suffering like my suffering,<br> suffering with which the Lord has afflicted me on the day of his blazing wrath.<br> At this I weep, my eyes run with tears<br> far from me are all who could console me,<br> far away are any who might revive me. (Lam. 1:12-16)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":.5, "fadeRate":500, "fadeDirection":1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":.2, "fadeRate":200, "fadeDirection":1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.3, "fadeRate":200, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":300, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":50, "fadeDirection":-1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":9, "stationNo":9, "stationName":"Jesus falls a third time", "scriptures":"<p>I lie prostrate in the dust; give me life according to your word. I declared my ways, and you answered me; teach me your commands. Make me understand the way of your precepts, and I will meditate on your wondrous deeds. My soul weeps for sorrow; strengthen me with your words. (Ps. 118:25-28)<\/p><p>The Lord is my light and my salvation;<br>whom should I fear?<br>The Lord is my life's refuge;<br>of whom should I be afraid?<br>When evildoers come at me to devour my flesh,<br>my foes and my enemies themselves stumble and fall.<br>Though an army encamp against me,<br>my heart will not fear;<br>though war be waged upon me,<br>even then will I trust. (Ps. 26:1-3)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":200, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.5, "fadeRate":200, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.1, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":.4, "fadeRate":50, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.1, "fadeRate":800, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":.5, "fadeRate":100, "fadeDirection":1} /* lo-pass pads */
                ]
        },
        {
            "stationID":10, "stationNo":10, "stationName":"Jesus is stripped of His clothes", "scriptures":"<p>They gave Jesus wine to drink mixed with gall; but when he had tasted it, He would not drink. Then, after they had crucified him, they divided his clothes, casting lots, to fulfill what was spoken through the prophet: \"They divided my clothes among them, and upon my garment they cast lots.\" (Mt. 27:34-35)<\/p> <p>Happy is the man whom God chastises!<br>Do not reject the punishment of the almighty<br>For he wounds, but he binds up;<br>he smites but his hands give healing.<br>Insult has broken my heart, and I am weak.<br>I looked for comforters and I found none.<br>Rather they put gall in my food<br>and in my thirst they gave me vinegar to drink (Job 5:17-18; Ps. 68:21-22)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":60, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.5, "fadeRate":50, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.5, "fadeRate":100, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.2, "fadeRate":100, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":.1, "fadeRate":30, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":.4, "fadeRate":50, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.3, "fadeRate":30, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":.1, "fadeRate":90, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":11, "stationNo":11, "stationName":"Jesus is nailed to the Cross", "scriptures":"<p>When they came to Golgotha, the place called the Skull, they crucified Jesus and the robbers, one on his right and the other on his left. And Jesus said, \"Father, forgive them for they do not know what they are doing.\" (Luke 23:33-35; John 19:18)<\/p><p>My God, my God, why have you forsaken me,<br>far from my prayer, far from the words of my cry?<br>O my God, I cry out by day, and you answer me not;<br>I cry out by night, and there is no relief for me.<br>All my bones are racked.<br>My heart has become like wax melting away within my chest.<br>My throat is dried up like baked clay, my tongue cleaves to my jaws;<br>they have pierced my hands and my feet;<br>I can count all my bones. (Ps. 21:2-3, 15-16, 17b)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":60, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.8, "fadeRate":100, "fadeDirection":1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":.6, "fadeRate":200, "fadeDirection":1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":.8, "fadeRate":1000, "fadeDirection":1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":.4, "fadeRate":1500, "fadeDirection":1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":.2, "fadeRate":50, "fadeDirection":1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.3, "fadeRate":250, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":90, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":12, "stationNo":12, "stationName":"Jesus dies on the Cross", "scriptures":"<p>It was now about the sixth hour, and there was darkness over the whole land until the ninth hour, And the sun was darkened, and the curtain of the temple was torn in the middle. Jesus cried out with a loud voice and said, \"It is finished. Father, into your hands I commend my spirit.\" Then, bowing his head, he died. (Luke 23:44-46; John 19:30b)<\/p><p>My people, what have I done to you? or in what have I offended you?<br>Answer me.<br>What more should I have done, and did not do?<br>I led you out of the land of Egypt, and you prepared a cross for me.<br>I opened the Red Sea before you, and you opened my side with a lance.<br>I gave you a royal scepter, and you have given me a crown of thorns.<br>With great power I lifted you up, and you have hung me upon a cross.<br>My people, what have I done to you, or in what have I offended you?<br>Answer me. (from the Reproaches of Good Friday)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":60, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":.1, "fadeRate":1000, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":150, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":30, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":30, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":50, "fadeDirection":-1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.3, "fadeRate":30, "fadeDirection":1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":90, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":13, "stationNo":13, "stationName":"The body of Jesus is taken down from the Cross", "scriptures":"<p>When the soldiers came to Jesus, they saw that he was already dead so that they did not break his legs, but one of them opened his side with a lance, and immediately there came out blood and water. Joseph of Arimathea, because he was a disciple of Jesus (although a secret one for fear of the Jews), besought Pilate that he might take away the body of Jesus And Pilate gave permission. (John 19:33-34,38a)<\/p><p>O my people, I will open your graves and have you rise from them,<br>and I will bring you back to your land.<br>Then you shall know that I am the Lord.<br>O my people! I will put my spirit in you that you may live.<br>You shall know then that I am the Lord.<br>I have promised it and I will do it, says the Lord. (Ezekiel 37:12-14)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":60, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":0, "fadeRate":150, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":30, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":30, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":30, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":50, "fadeDirection":-1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":.1, "fadeRate":250, "fadeDirection":-1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":90, "fadeDirection":-1} /* lo-pass pads */
                ]
        },
        {
            "stationID":14, "stationNo":14, "stationName":"Jesus is laid in the tomb", "scriptures":"<p>Joseph of Arimathea took the body of Jesus, and wrapping it in a clean linen cloth he laid it in his new tomb, which he had hewn out of rock. Then he rolled a large stone against the entrance of the tomb and departed. (Mt. 27:59-60)<\/p> <p>I will praise you, O Lord, for you lifted me out of the depths and did not<br>let my enemies rejoice over me.<br>O Lord, my God, I cried out to you and you healed me.<br>O Lord, you brought me up from the lower world;<br>you preserved me from among those going down into the pit.<br>Sing praise to the Lord, you his faithful ones, and give thanks to his holy name.<br>For his anger lasts but a moment; his good will is for a lifetime.<br>Weeping may endure for a night<br>but joy comes in the morning. (Ps 30:1-5)<\/p>",
                "statioAutomation":[
                    {"fadetrack":1, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* pads and strings intro */
                    {"fadetrack":2, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* crunchy feet */
                    {"fadetrack":3, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* mob anger rise */
                    {"fadetrack":4, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* heart beat slow */
                    {"fadetrack":5, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* heart beat fast */
                    {"fadetrack":6, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* boos deminish */
                    {"fadetrack":7, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* whispery breaths*/
                    {"fadetrack":8, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1}, /* darkness crypt */
                    {"fadetrack":9, "fadeFinal":0, "fadeRate":100, "fadeDirection":-1} /* lo-pass pads */
                ]
        }
];

/* this writes/populates the Html with audio player notes, each containing a unique sample */
function makeMyAudioMixingTable() {
    var mixtableSize = audioStemsArray.length;
    var i;
    var audioNodeString, audioTableString;
    audioTableString = '<h3>Sound Stems</h3> Background Audio. Used for debugging and soundtrack composition. <table class="table table-condensed"> <thead> <tr> <th>audio node</th> <th>Player</th> <th>Path Reference</th> </tr></thead><tbody>';
    for (i=1; i < mixtableSize; i+=1){
        audioTableString = audioTableString + "<tr><td>"+i+"</td><td>";
        audioNodeString = "<audio id='sample" + i + "' class='audioDemo' controls loop preload='none'> <source src='" + audioStemsArray[i] + "' type='audio/mpeg'> </audio>";
        audioTableString = audioTableString + audioNodeString;
        audioTableString = audioTableString + "</td> <td> <a href='" + audioStemsArray[i] + "' target='_blank'>" + audioStemsArray[i] + "</a></td> </tr>";
    }
    audioTableString = audioTableString + "</tbody> </table>";
    $("#soundClips").append(audioTableString + "<p> I am using MP3 audio in the html5 audio tag. You are welcome to substitute in your own sounds.</p>");
}

function volumeUp(){
    var volume = $(".audioDemo").prop("volume")+0.2;
    if(volume >1){
        volume = 1;
    }
    $(".audioDemo").prop("volume",volume);
}
function volumeDown(){
    var volume = $(".audioDemo").prop("volume")-0.2;
    if(volume <0){
        volume = 0;
    }
    $(".audioDemo").prop("volume",volume);
}
function toggleMuteAudio(){
    $(".audioDemo").prop("muted",!$(".audioDemo").prop("muted"));
}
$("#myMute").click(function () {
    $(this).text(function(i, v){
        return v === "Mute" ? "Un-mute" : "Mute"
    })
});

function startAll(){
    slideCounter = 1;
    $('.audioDemo').trigger('play');
    $('.audioDemo').prop('volume', '0');
    
    stopAtStation(slideCounter);
	transitionColor(slideCounter);

    $("button").prop("disabled",false);    
}

/* This slides the track volume up or down depending on the station landing */
function volFade(sampleIdNo, maxVol, speed, direction) {
    var idName = "#sample"+sampleIdNo;
    if (typeof fadeAutomation[sampleIdNo] !== "undefined"){
        clearInterval(fadeAutomation[sampleIdNo]);
        fadeAutomation[sampleIdNo] = null;
    }
    fadeAutomation[sampleIdNo] = setInterval( function() {
        volume = $(idName).prop("volume")+(0.01*direction);
        if (direction > 0) {
            if(volume > maxVol) {
                $(idName).prop("volume",maxVol);
                clearInterval(fadeAutomation[sampleIdNo]);
                fadeAutomation[sampleIdNo] = null;
                return;
            }
        } else {
            if(volume < 0) {
                $(idName).prop("volume",maxVol);
                clearInterval(fadeAutomation[sampleIdNo]);
                fadeAutomation[sampleIdNo] = null;
                return;
            }
        }
        $(idName).prop("volume",volume);
    }, speed);
}

/* performed when a forward progress on the stations is made */
function stopAtStation(stationID) {
    for (trackStem = 0; trackStem < stationJSON[stationID].statioAutomation.length; trackStem += 1) {
        var fadetrack  = stationJSON[stationID].statioAutomation[trackStem].fadetrack;
        var fadeFinal = stationJSON[stationID].statioAutomation[trackStem].fadeFinal;
        var fadeRate = stationJSON[stationID].statioAutomation[trackStem].fadeRate;
        var fadeDirection = stationJSON[stationID].statioAutomation[trackStem].fadeDirection;
        volFade(fadetrack, fadeFinal, fadeRate, fadeDirection);
    }
    $("#readings").html(stationJSON[stationID].scriptures);
    $("#stationLabel").html("<p><h3>Station: "+stationJSON[stationID].stationNo + ", " + stationJSON[stationID].stationName + "</h3></p>");

    slideCounter = stationID; // redundandant update global position counter if bead navigation was clicked instead of rt/lt nav
}

/* performed when a reverse progress on the stations is made */
/* i made this mostly to handle: fadeDirection = fadeDirection * -1; */
function stopAtStationRev(stationID) {
    for (trackStem = 0; trackStem < stationJSON[stationID].statioAutomation.length; trackStem += 1) {
        var fadetrack  = stationJSON[stationID].statioAutomation[trackStem].fadetrack;
        var fadeFinal = stationJSON[stationID].statioAutomation[trackStem].fadeFinal;
        var fadeRate = stationJSON[stationID].statioAutomation[trackStem].fadeRate;
        var fadeDirection = stationJSON[stationID].statioAutomation[trackStem].fadeDirection;

        fadeDirection = fadeDirection * -1;
        volFade(fadetrack, fadeFinal, fadeRate, fadeDirection);
    }
    $("#readings").html(stationJSON[stationID].scriptures);
    $("#stationLabel").html("<p><h3>Station: "+stationJSON[stationID].stationNo + ", " + stationJSON[stationID].stationName + "</h3></p>");
}
