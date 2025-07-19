import { OpenAlexService } from '../src/lib/api/services/openalex.service.js';

async function testOpenAlex() {
  console.log('Testing OpenAlex Service...');
  
  const openAlex = new OpenAlexService();
  
  // Test 1: Search for works
  console.log('\n=== Testing searchWorks ===');
  const searchResult = await openAlex.searchWorks({
    query: 'machine learning',
    page: 1,
    perPage: 3,
    sortBy: 'cited_by_count:desc'
  });
  
  if (!searchResult.success || !searchResult.data) {
    console.error('❌ Search failed:', searchResult.error);
    return;
  }

  console.log(`✅ Found ${searchResult.data.meta?.count?.toLocaleString() || '0'} results`);
  
  const firstResult = searchResult.data.results?.[0];
  if (firstResult) {
    console.log(`📄 First result: ${firstResult.title || 'No title'}`);
    if (firstResult.abstract) {
      console.log(`📚 Abstract: ${firstResult.abstract.substring(0, 150)}...`);
    } else {
      console.log('📚 No abstract available');
    }
  }
  
  // If we have results, test getting a specific work
  if (searchResult.data.results?.length > 0) {
    const workId = searchResult.data.results[0].id;
    console.log(`\n=== Testing getWork for ID: ${workId} ===`);
    
    const workResult = await openAlex.getWork(workId);
    
    if (workResult.success && workResult.data) {
      console.log(`✅ Successfully retrieved work: ${workResult.data.title}`);
      console.log(`📅 Published: ${workResult.data.publication_year}`);
      console.log(`📊 Citations: ${workResult.data.cited_by_count}`);
      
      // Test getting related works
      console.log('\n=== Testing getRelatedWorks ===');
      const relatedWorks = await openAlex.getRelatedWorks(workId, 1, 2);
      
      if (relatedWorks.success && relatedWorks.data) {
        console.log(`✅ Found ${relatedWorks.data.meta.count} related works`);
        if (relatedWorks.data.results.length > 0) {
          console.log(`📄 First related work: ${relatedWorks.data.results[0]?.title}`);
        }
      } else {
        console.error('❌ Failed to get related works:', relatedWorks.error);
      }
    } else {
      console.error('❌ Failed to get work:', workResult.error);
    }
  }
  
  console.log('\n=== OpenAlex Service Test Completed ===');
}

// Run the test
testOpenAlex().catch(console.error);
