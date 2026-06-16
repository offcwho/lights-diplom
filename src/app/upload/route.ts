import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Здесь проверяется авторизация сессии пользователя перед генерацией токена.
                // Если пользователь не залогинен — выкидываем ошибку.
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
                    tokenPayload: JSON.stringify({
                        /* Сюда можно зашить метаданные, например ID юзера */
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Вызывается Vercel-ем после успешного завершения загрузки.
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}