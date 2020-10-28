# Smart-Calendar

![](https://raw.githubusercontent.com/shipmentx/Smart-Calendar/main/icons/icon_128.png)
## Inspiration

We have a bit lengthy process to do simple things like creating calendar entries from webpages. To do that, we need to open our calendar, copy the subject line, and then we have to update the required fields manually.

Also, the lack of a chrome extension for this simple task inspired me to take this project.


## What it does

Smart Calendar automatically -

- **Creates calendar entries** by scanning through the active webpage.
- Able to **identifies** dates, subject, time, and ~~**appropriate time zones**~~ through intelligence.
- Also, **updates relevant fields in the calendar.**


## How I built it

- It **takes a screenshot** of the active webpage.
- The **screenshot** is **processed by Tesseract** to extract text from the image.
- Then it **identifies** *subject, date, time and time zones* **from the extracted text.**
- **Updates** relevant **fields in the calendar with all the extracted parameters.**
- Shows the calendar in edit mode to confirm and save the event.


## Challenges I ran into

- Various websites use different date and time formats and correspond to distinct time zones.
- The main challenge is, **writing regular expressions** for the Intelligence to understand various date and time formats.
- **Processing the information locally within the browser** and not sending any user information to the server, thereby **ensuring user privacy.**


## How to install this chrome extension

 - Clone this repository
 - open chrome://extensions in chrome broswer
 - Enable **developer mode** toggle button which is in **top right corner**
 - Click on **Load unpacked** button in the **top left corner**
 - Open any website in the chrome, then open **Smart Calander** Extension and click **Execute OCR** button
 - That's it.


## What I learned

 - Optical character recognition(**OCR**) using **Tesseract** library
 - How to take a screenshot with chrome extension
 - Enhancing the screenshot using various Machine Learning(**ML**) techniques
 - Identifying different date formats from complex strings using Machine Learning(**ML**) methods with confidence scores


## What's next for Smart Calendar

- Implementing for various timezones and complex scenarios 
- Making it freely available to the public through Chrome extension apps