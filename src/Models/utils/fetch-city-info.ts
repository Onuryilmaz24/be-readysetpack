async function fetchCityInfo(city: string, maxLength: number = 500): Promise<string> {
    const endpoint = 'https://en.wikipedia.org/w/api.php';
    
    const params = {
      action: 'query',
      format: 'json',
      prop: 'extracts',
      exintro: true, 
      titles: city, 
      explaintext: true,
    };
  
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      urlParams.append(key, String(value)); 
    }
  
    try {
      const response = await fetch(`${endpoint}?${urlParams.toString()}`);
      

      const data = await response.json();
      
      const pageId = Object.keys(data.query.pages)[0];
      const pageContent = data.query.pages[pageId]?.extract || 'No information available';
  
      let limitedContent = pageContent.slice(0, maxLength);
  
      const sentenceEnd = limitedContent.lastIndexOf('.', limitedContent.lastIndexOf('.') + 1);
      const exclamationEnd = limitedContent.lastIndexOf('!', limitedContent.lastIndexOf('!') + 1);
      const questionEnd = limitedContent.lastIndexOf('?', limitedContent.lastIndexOf('?') + 1);
  
      const end = Math.max(sentenceEnd, exclamationEnd, questionEnd);
  
    
      if (end !== -1) {
        limitedContent = limitedContent.slice(0, end + 1);
      }
  
      return limitedContent;
    } catch (error) {
      console.error('Error fetching city info from MediaWiki:', error);
      return 'Error fetching city information';
    }
  }
  
  
  export default fetchCityInfo