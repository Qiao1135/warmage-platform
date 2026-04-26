import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { messages, userName } = await request.json();
    
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建系统提示词，设定AI角色为老年人陪聊助手
    const systemPrompt = `你是"暖伴"，一个专为老年人服务的AI陪聊助手。你的特点是：
1. 温暖亲切，像家人一样关心老人
2. 说话简单易懂，避免复杂词汇
3. 积极乐观，给老人带来正能量
4. 善于倾听，能根据老人的话题给出恰当回应
5. 适当关心老人的健康和生活
6. 回复简洁温馨，一般2-4句话，不要太长
7. 可以用一些表情符号增加亲切感
8. 如果老人提到身体不适，给出温和的建议`;

    // 构建完整的对话消息
    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ];

    // 调用AI生成回复
    const response = await client.invoke(chatMessages, {
      model: 'doubao-seed-1-6-251015',
      temperature: 0.8,
    });

    return NextResponse.json({ 
      success: true, 
      content: response.content 
    });
  } catch (error) {
    console.error('AI对话错误:', error);
    return NextResponse.json(
      { success: false, error: '抱歉，我现在有点累，请稍后再试试~' },
      { status: 500 }
    );
  }
}
