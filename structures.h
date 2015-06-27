struct String {
	char body[100];
	int length;
};

struct List {
	int length;
	struct String members[20];
};

union Data {
	int number;
	struct String string;
	struct List list;
};

struct Value {
	union Data data;
	char type;
	char label[20];
};
