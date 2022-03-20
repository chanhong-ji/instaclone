export const hashtagProcess = (caption: string | null) => {
  if (!caption) return [];
  const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g) || [];
  const objList = hashtags.map((hashtag: string) => ({
    where: { hashtag: hashtag.toLowerCase() },
    create: { hashtag: hashtag.toLowerCase() },
  }));
  return objList;
};
